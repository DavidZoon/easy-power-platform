# frozen_string_literal: true

require 'jekyll'
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
puts 'Liens externes : nouvel onglet, protections, liens internes et code préservés : OK.'
