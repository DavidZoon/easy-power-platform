require "tmpdir"
require "fileutils"
require "jekyll"
require_relative "../_plugins/taxonomies"

class TaxonomiesTest
  def assert_equal(expected, actual)
    raise "Attendu #{expected.inspect}, obtenu #{actual.inspect}" unless expected == actual
  end

  def assert_raises(type)
    begin
      yield
    rescue type
      return
    end
    raise "Exception attendue : #{type}"
  end
  def with_site
    Dir.mktmpdir("tool-taxonomies") do |source|
      FileUtils.mkdir_p(File.join(source, "_posts"))
      File.write(File.join(source, "_posts", "2020-01-01-example.md"), "---\ntitle: Example\ncategories: [Child]\ntags: [Code]\n---\nArticle")
      FileUtils.mkdir_p(File.join(source, "outils", "example"))
      File.write(File.join(source, "outils", "example", "index.html"), "---\npermalink: /outils/example/\n---\nOutil")
      site = Jekyll::Site.new(Jekyll.configuration("source" => source, "destination" => File.join(source, "_site"), "quiet" => true))
      site.read
      site.data["category_hierarchy"] = { "Child" => "Parent" }
      site.data["tools"] = [{ "name" => "Outil", "url" => "/outils/example/", "categories" => ["Child", "Parent"], "tags" => ["Code"] }]
      yield site
    end

  end

  def test_inherits_without_duplicates_and_preserves_article_counts
    with_site do |site|
      EasyPowerPlatform::Taxonomies.new.generate(site)
      %w[Child Parent].each do |name|
        term = site.data["taxonomies"]["categories"].find { |term| term["name"] == name }
        assert_equal [2, 1, 1], term.values_at("count", "post_count", "tool_count")
        page = site.pages.find { |page| page.data["term"] == name }
        assert_equal 1, page.data["term_posts"].size
        assert_equal 1, page.data["term_tools"].size
      end
      page = site.pages.find { |page| page.url == "/outils/example/" }
      assert_equal ["Child", "Parent"], page.data["tool_categories"]
      assert_equal ["Code"], page.data["tool_tags"]
    end
  end

  def test_rejects_unknown_terms_and_missing_tool_pages
    with_site do |site|
      site.data["tools"][0]["tags"] = ["Typo"]
      assert_raises(Jekyll::Errors::FatalException) { EasyPowerPlatform::Taxonomies.new.generate(site) }
      site.data["tools"][0]["url"] = "/missing/"
      assert_raises(Jekyll::Errors::FatalException) { EasyPowerPlatform::Taxonomies.new.generate(site) }
    end
  end

  def test_normalizes_tags_counts_and_redirects_without_changing_categories
    with_site do |site|
      post = site.posts.docs.first
      post.data["tags"] = ["Snippet", "snippet", "snipet", "Code", " CODE "]
      site.data["tag_aliases"] = { "Snippet" => ["snippet", "snipet"] }
      site.data["tools"][0]["tags"] = [" SNIPET ", "snippet", "code"]
      site.tags
      %w[snippet snipet].each_with_index do |name, index|
        file = File.join(site.source, "_posts", "2020-01-0#{index + 2}-#{name}.md")
        File.write(file, "---\ntitle: #{name}\ncategories: [Child]\ntags: [#{name}]\n---\nArticle")
        document = Jekyll::Document.new(file, site: site, collection: site.posts)
        document.read
        site.posts.docs << document
        page = Jekyll::PageWithoutAFile.new(site, site.source, "tags", "#{name}.html")
        page.data.merge!("taxonomy" => "tags", "term" => name, "permalink" => "/tags/#{EasyPowerPlatform::Taxonomies.new.send(:slug, name)}/")
        site.pages << page
      end
      hub = site.pages.first
      hub.data["tags"] = ["snipet", "Snippet"]
      generator = EasyPowerPlatform::Taxonomies.new
      generator.generate(site)
      terms = site.data["taxonomies"]["tags"]
      assert_equal ["Code", "Snippet"], terms.map { |term| term["name"] }.sort
      assert_equal terms.length, terms.map { |term| term["hue"] }.uniq.length
      snippet = terms.find { |term| term["name"] == "Snippet" }
      assert_equal [4, 3, 1], snippet.values_at("count", "post_count", "tool_count")
      assert_equal ["Snippet", "Code"], post.data["tags"]
      assert_equal ["Snippet"], hub.data["tags"]
      assert_equal ["Snippet", "Code"], hub.data["tool_tags"]
      assert_equal 3, site.tags["Snippet"].uniq.length
      assert_equal ["Code", "Snippet"], site.tags.keys.sort
      assert_equal ["Child"], post.data["categories"]
      %w[snippet snipet].each do |name|
        permalink = "/tags/#{generator.send(:slug, name)}/"
        redirects = site.pages.select { |page| page.url == permalink }
        assert_equal 1, redirects.length
        assert_equal "/tags/#{snippet['slug']}/", redirects.first.data["redirect_to"]
        assert_equal [true, false, nil], redirects.first.data.values_at("noindex", "sitemap", "taxonomy")
      end
      assert_equal true, snippet["hue"].between?(0, 359)
      generator.generate(site)
      assert_equal terms, site.data["taxonomies"]["tags"]
      assert_equal 1, site.pages.count { |page| page.data["taxonomy"] == "tags" && page.data["term"] == "Snippet" }
    end
  end

  def test_normalizes_case_spaces_and_unicode_without_aliases
    with_site do |site|
      site.posts.docs.first.data["tags"] = ["Code", "code", " Power   Fx ", "power fx", "Vidéo", "Vide\u0301o"]
      site.data["tools"][0]["tags"] = ["CODE"]
      EasyPowerPlatform::Taxonomies.new.generate(site)
      assert_equal ["Code", "Power Fx", "Vidéo"], site.posts.docs.first.data["tags"]
      assert_equal ["Code"], site.data["tools"][0]["tags"]
    end
  end

  tests = TaxonomiesTest.new
  tests.test_inherits_without_duplicates_and_preserves_article_counts
  tests.test_rejects_unknown_terms_and_missing_tool_pages
  tests.test_normalizes_tags_counts_and_redirects_without_changing_categories
  tests.test_normalizes_case_spaces_and_unicode_without_aliases
  puts "Taxonomies : héritage, tags regroupés, compteurs, couleurs stables, redirections et erreurs de configuration : OK."
end
