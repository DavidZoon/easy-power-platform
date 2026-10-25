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

  tests = TaxonomiesTest.new
  tests.test_inherits_without_duplicates_and_preserves_article_counts
  tests.test_rejects_unknown_terms_and_missing_tool_pages
  puts "Taxonomies : héritage sans doublon, compteurs et erreurs de configuration : OK."
end
