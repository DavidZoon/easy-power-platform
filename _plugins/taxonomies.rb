require "digest"

module EasyPowerPlatform
  class Taxonomies < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      tools = Array(site.data["tools"])
      tools.each do |tool|
        page = site.pages.find { |candidate| candidate.url == tool["url"] }
        raise Jekyll::Errors::FatalException, "Page d'outil introuvable : #{tool['url']}" unless page
        page.data["tool_categories"] = tool["categories"]
        page.data["tool_tags"] = tool["tags"]
      end
      registry = {}
      %w[categories tags].each do |type|
        parents = type == "categories" ? hierarchy(site) : {}
        direct = site.public_send(type)
        existing = (direct.keys + direct.keys.flat_map { |name| ancestors(name, parents) }).uniq
        tools.each do |tool|
          values = tool[type]
          unless values.is_a?(Array) && !values.empty? && values.all? { |value| existing.include?(value) }
            raise Jekyll::Errors::FatalException, "Taxonomie #{type} invalide pour l'outil #{tool['name']} : utilisez les termes existants."
          end
        end
        names = existing
        children = names.group_by { |name| parents[name] }
        terms = names.to_h do |name|
          included_terms = [name] + descendants(name, children)
          posts = included_terms.flat_map { |term| direct[term] || [] }.uniq
          term_tools = tools.select { |tool| (tool[type] & included_terms).any? }.uniq { |tool| tool["url"] }
          [name, { "name" => name, "slug" => slug(name), "count" => posts.length + term_tools.length,
            "post_count" => posts.length, "tool_count" => term_tools.length,
            "posts" => posts.sort_by(&:date).reverse, "tools" => term_tools }]
        end
        terms.each_value do |term|
          term["parent"] = parents[term["name"]] if names.include?(parents[term["name"]])
          term["depth"] = ancestors(term["name"], parents).length
          term["ancestors"] = ancestors(term["name"], parents).reverse.map { |name| summary(terms[name]) }
          term["children"] = sorted(Array(children[term["name"]]).map { |name| terms[name] }).map { |child| summary(child) }
        end
        registry[type] = sorted(terms.values).map { |term| term.reject { |key, _| %w[posts tools].include?(key) } }
        site.pages.reject! { |page| page.data["taxonomy"] == type && !names.include?(page.data["term"]) }
        terms.each_value do |term|
          page = site.pages.find { |candidate| candidate.data["taxonomy"] == type && candidate.data["term"] == term["name"] }
          unless page
            page = Jekyll::PageWithoutAFile.new(site, site.source, type, "#{term['slug']}.html")
            site.pages << page
          end
          page.data.merge!(
            "layout" => "taxonomy", "title" => term["name"], "term" => term["name"],
            "taxonomy" => type, "permalink" => "/#{type}/#{term['slug']}/",
            "term_posts" => term["posts"], "term_tools" => term["tools"],
            "post_count" => term["post_count"], "tool_count" => term["tool_count"],
            "ancestors" => term["ancestors"], "children" => term["children"]
          )
        end
      end
      site.data["taxonomies"] = registry
    end

    private

    def hierarchy(site)
      (site.data["category_hierarchy"] || {}).to_h { |child, parent| [child.to_s, parent.to_s] }
    end

    def slug(name)
      stem = name.unicode_normalize(:nfkd).gsub(/[\u0300-\u036f]/, "")
        .downcase.gsub(/[^a-z0-9]+/, "-").gsub(/^-|-$/, "")
      stem = "terme" if stem.empty?
      "#{stem}-#{Digest::SHA256.hexdigest(name)[0, 8]}"
    end

    # Walks up the parent chain, stopping on cycles.
    def ancestors(name, parents)
      chain = []
      current = parents[name]
      while current && current != name && !chain.include?(current)
        chain << current
        current = parents[current]
      end
      chain
    end

    def descendants(name, children, seen = [name])
      Array(children[name]).reject { |child| seen.include?(child) }.flat_map do |child|
        [child] + descendants(child, children, seen + [child])
      end
    end

    def sorted(terms)
      terms.sort_by { |term| [-term["count"], term["name"].downcase] }
    end

    def summary(term)
      term.slice("name", "slug", "count", "post_count", "tool_count")
    end
  end
end
