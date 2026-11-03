# frozen_string_literal: true

require 'nokogiri'
require 'uri'

module EasyPowerPlatform
  module ExternalLinks
    LEARN_PARAMETER = 'wt.mc_id=MVP_339053'

    def self.tracking_parameter?(part)
      URI::DEFAULT_PARSER.unescape(part.partition('=').first).casecmp?('wt.mc_id')
    end

    def self.track_learn(href)
      without_fragment, hash, fragment = href.partition('#')
      base, question, query = without_fragment.partition('?')
      parameters = question.empty? || query.empty? ? [] : query.split('&')
      parameters.reject! { |part| tracking_parameter?(part) }
      parameters << LEARN_PARAMETER

      unless hash.empty?
        anchor, separator, fragment_query = fragment.partition('?')
        unless separator.empty?
          fragment_parameters = fragment_query.split('&')
          remaining = fragment_parameters.reject { |part| tracking_parameter?(part) }
          if remaining.length != fragment_parameters.length
            fragment = remaining.empty? ? anchor : "#{anchor}?#{remaining.join('&')}"
          end
        end
      end

      "#{base}?#{parameters.join('&')}#{hash}#{fragment}"
    end

    def self.learn_host?(url)
      return false unless url.host

      # The URL was escaped for URI.parse; decode that layer and any encoded hostname.
      host = URI::DEFAULT_PARSER.unescape(URI::DEFAULT_PARSER.unescape(url.host))
      host.downcase.delete_suffix('.') == 'learn.microsoft.com'
    end

    def self.decorate(html, site_url)
      origin = URI.parse(site_url)
      document = Nokogiri::HTML5.parse(html)
      document.css('a[href]').each do |link|
        href = link['href'].strip
        next unless href.match?(%r{\A(?:https?://|//)}i)

        absolute = href.start_with?('//') ? "#{origin.scheme}:#{href}" : href
        url = URI.parse(URI::DEFAULT_PARSER.escape(absolute))
        link['href'] = track_learn(href) if learn_host?(url)
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
