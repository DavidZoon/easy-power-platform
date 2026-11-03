# frozen_string_literal: true

require 'jekyll'
require 'tmpdir'
require 'fileutils'
require_relative '../_plugins/external_links'

html = <<~HTML
  <!doctype html><html><body>
  <a href="https://example.org/été" rel="nofollow">Externe</a>
  <a href="//example.org/page" target="_self">Externe relatif au protocole</a>
  <a href="https://blog.example/page">Interne absolu</a>
  <a href="/page">Interne</a><a href="#titre">Ancre</a>
  <a href="mailto:test@example.org">Courriel</a>
  <pre>&lt;a href="https://example.org/"&gt;Exemple&lt;/a&gt;</pre>
  </body></html>
HTML
result = EasyPowerPlatform::ExternalLinks.decorate(html, 'https://blog.example')
document = Nokogiri::HTML5.parse(result)
links = document.css('a')
links.first(2).each do |link|
  raise 'Nouvel onglet absent' unless link['target'] == '_blank'
  raise 'Protection absente' unless %w[noopener noreferrer].all? { |token| link['rel'].split.include?(token) }
end
raise 'Attribut rel écrasé' unless links.first['rel'].include?('nofollow')
raise 'Lien Unicode modifié' unless links.first['href'] == 'https://example.org/été'
raise 'Liens internes modifiés' unless links.drop(2).all? { |link| link['target'].nil? }
raise 'Exemple de code modifié' unless document.at_css('pre').text == '<a href="https://example.org/">Exemple</a>'
raise 'Transformation non idempotente' unless result == EasyPowerPlatform::ExternalLinks.decorate(result, 'https://blog.example')

learn_html = <<~HTML
  <!doctype html><html><body>
  <a id="plain" href="https://learn.microsoft.com/fr-fr/power-apps/">Simple</a>
  <a id="anchor" href="https://learn.microsoft.com/path#section">Ancre</a>
  <a id="query" href="https://learn.microsoft.com/path?tabs=csom&amp;locale=fr#section">Paramètres</a>
  <a id="existing" href="https://learn.microsoft.com/path?WT.mc_id=old&amp;tabs=csom&amp;wt.mc_id=MVP_339053#section">Doublons</a>
  <a id="encoded" href="https://learn.microsoft.com/path?q=a%26b&amp;wt%2Emc_id=old">Encodage</a>
  <a id="fragment" href="https://learn.microsoft.com/path#section?WT.mc_id=MVP_339053">Paramètre après l'ancre</a>
  <a id="fragment-query" href="https://learn.microsoft.com/path#section?tab=one&amp;WT.mc_id=old">Autre paramètre de fragment</a>
  <a id="empty-query" href="https://learn.microsoft.com/path?a=1&amp;&amp;b=2">Paramètre vide</a>
  <a id="unicode" href="https://learn.microsoft.com/fr-fr/été#résumé">Unicode</a>
  <a id="protocol-relative" href="//LEARN.MICROSOFT.COM/path">Sans protocole</a>
  <a id="trailing-dot" href="http://learn.microsoft.com./path">Domaine absolu</a>
  <a id="encoded-host" href="https://learn%2Emicrosoft.com/path">Domaine encodé</a>
  <a id="other" href="https://learn.microsoft.com.example.org/path">Autre domaine</a>
  <a id="redirect" href="https://example.org/?next=https://learn.microsoft.com/path">Lien tiers</a>
  <a id="userinfo" href="https://learn.microsoft.com@example.org/path">Identifiant trompeur</a>
  <pre>&lt;a href="https://learn.microsoft.com/path"&gt;Exemple&lt;/a&gt;</pre>
  </body></html>
HTML
learn_result = EasyPowerPlatform::ExternalLinks.decorate(learn_html, 'https://blog.example')
learn_document = Nokogiri::HTML5.parse(learn_result)
expected = {
  'plain' => 'https://learn.microsoft.com/fr-fr/power-apps/?wt.mc_id=MVP_339053',
  'anchor' => 'https://learn.microsoft.com/path?wt.mc_id=MVP_339053#section',
  'query' => 'https://learn.microsoft.com/path?tabs=csom&locale=fr&wt.mc_id=MVP_339053#section',
  'existing' => 'https://learn.microsoft.com/path?tabs=csom&wt.mc_id=MVP_339053#section',
  'encoded' => 'https://learn.microsoft.com/path?q=a%26b&wt.mc_id=MVP_339053',
  'fragment' => 'https://learn.microsoft.com/path?wt.mc_id=MVP_339053#section',
  'fragment-query' => 'https://learn.microsoft.com/path?wt.mc_id=MVP_339053#section?tab=one',
  'empty-query' => 'https://learn.microsoft.com/path?a=1&&b=2&wt.mc_id=MVP_339053',
  'unicode' => 'https://learn.microsoft.com/fr-fr/été?wt.mc_id=MVP_339053#résumé',
  'protocol-relative' => '//LEARN.MICROSOFT.COM/path?wt.mc_id=MVP_339053',
  'trailing-dot' => 'http://learn.microsoft.com./path?wt.mc_id=MVP_339053',
  'encoded-host' => 'https://learn%2Emicrosoft.com/path?wt.mc_id=MVP_339053',
  'other' => 'https://learn.microsoft.com.example.org/path',
  'redirect' => 'https://example.org/?next=https://learn.microsoft.com/path',
  'userinfo' => 'https://learn.microsoft.com@example.org/path'
}
expected.each do |id, href|
  actual = learn_document.at_css("##{id}")['href']
  raise "URL incorrecte pour #{id} : #{actual}" unless actual == href
end
raise 'Exemple Microsoft Learn modifié' unless learn_document.at_css('pre').text == '<a href="https://learn.microsoft.com/path">Exemple</a>'
raise 'Suivi Microsoft Learn non idempotent' unless learn_result == EasyPowerPlatform::ExternalLinks.decorate(learn_result, 'https://blog.example')

Dir.mktmpdir('learn-links') do |directory|
  source = File.join(directory, 'source')
  destination = File.join(directory, 'site')
  FileUtils.mkdir_p(File.join(source, '_drafts'))
  File.write(File.join(source, 'index.md'), "---\n---\n[Learn](https://learn.microsoft.com/page?tabs=one#topic)\n")
  File.write(File.join(source, '_drafts', 'article.md'), "---\ntitle: Brouillon\n---\n[Learn](https://learn.microsoft.com/draft#topic)\n")
  config = Jekyll.configuration(
    'source' => source, 'destination' => destination, 'url' => 'https://blog.example',
    'quiet' => true, 'plugins' => [], 'show_drafts' => true, 'disable_disk_cache' => true
  )
  site = Jekyll::Site.new(config)
  site.process
  page = Nokogiri::HTML5.parse(File.read(File.join(destination, 'index.html')))
  raise 'Lien futur de page non transformé' unless page.at_css('a')['href'] == 'https://learn.microsoft.com/page?tabs=one&wt.mc_id=MVP_339053#topic'
  draft = site.posts.docs.find { |post| post.data['title'] == 'Brouillon' }
  raise 'Brouillon absent du rendu' unless draft
  raise 'Lien futur de brouillon non transformé' unless Nokogiri::HTML5.parse(draft.output).at_css('a')['href'] == 'https://learn.microsoft.com/draft?wt.mc_id=MVP_339053#topic'
end
puts 'Liens externes et Microsoft Learn : protections, paramètres, ancres, domaines et code : OK.'
