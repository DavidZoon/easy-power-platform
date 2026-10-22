require "digest"

module EasyPowerPlatform
  class Taxonomies < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      registry = {}
      %w[categories tags].each do |type|
        terms = site.public_send(type).map do |name, posts|
          stem = name.unicode_normalize(:nfkd).gsub(/[\u0300-\u036f]/, "")
            .downcase.gsub(/[^a-z0-9]+/, "-").gsub(/^-|-$/, "")
          stem = "terme" if stem.empty?
          slug = "#{stem}-#{Digest::SHA256.hexdigest(name)[0, 8]}"
          { "name" => name, "slug" => slug, "count" => posts.length }
        end
        registry[type] = terms.sort_by { |term| [-term["count"], term["name"].downcase] }
        names = terms.map { |term| term["name"] }
        site.pages.reject! { |page| page.data["taxonomy"] == type && !names.include?(page.data["term"]) }
        terms.each do |term|
          page = site.pages.find { |candidate| candidate.data["taxonomy"] == type && candidate.data["term"] == term["name"] }
          unless page
            page = Jekyll::PageWithoutAFile.new(site, site.source, type, "#{term['slug']}.html")
            site.pages << page
          end
          page.data.merge!(
            "layout" => "taxonomy", "title" => term["name"], "term" => term["name"],
            "taxonomy" => type, "permalink" => "/#{type}/#{term['slug']}/"
          )
        end
      end
      site.data["taxonomies"] = registry
    end
  end
end
