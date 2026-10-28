# frozen_string_literal: true

require 'nokogiri'
require 'uri'

module EasyPowerPlatform
  module ExternalLinks
    def self.decorate(html, site_url)
      origin = URI.parse(site_url)
      document = Nokogiri::HTML5.parse(html)
      document.css('a[href]').each do |link|
        href = link['href'].strip
        next unless href.match?(%r{\A(?:https?://|//)}i)

        absolute = href.start_with?('//') ? "#{origin.scheme}:#{href}" : href
        url = URI.parse(URI::DEFAULT_PARSER.escape(absolute))
        next if [url.scheme, url.host, url.port] == [origin.scheme, origin.host, origin.port]

        link['target'] = '_blank'
        link['rel'] = ((link['rel'] || '').split + %w[noopener noreferrer]).uniq.join(' ')
      end
      document.to_html
    end
  end
end

Jekyll::Hooks.register [:documents, :pages], :post_render do |item|
  next unless item.output_ext == '.html'

  item.output = EasyPowerPlatform::ExternalLinks.decorate(item.output, item.site.config['url'])
end
