require "fileutils"
require "tmpdir"
require "yaml"
require "jekyll"
require "nokogiri"

def rendered_tool_urls(tools)
  Dir.mktmpdir("home-tools") do |source|
    layouts = File.join(source, "_layouts")
    includes = File.join(source, "_includes")
    data = File.join(source, "_data")
    destination = File.join(source, "_site")
    [layouts, includes, data].each { |dir| FileUtils.mkdir_p(dir) }
    FileUtils.cp(File.join(__dir__, "..", "_layouts", "home.html"), layouts)
    File.write(File.join(layouts, "default.html"), "---\n---\n{{ content }}")
    File.write(File.join(source, "index.html"), "---\nlayout: home\n---\n")
    %w[search-form article-icon tool-icon share sidebar post-card newsletter].each do |name|
      File.write(File.join(includes, "#{name}.html"), "")
    end
    File.write(File.join(includes, "tool-card.html"), '<a href="{{ include.tool.url }}">{{ include.tool.name }}</a>')
    File.write(File.join(data, "tools.yml"), tools.to_yaml)
    config = Jekyll.configuration("source" => source, "destination" => destination, "quiet" => true, "plugins" => [])
    Jekyll::Site.new(config).process
    html = Nokogiri::HTML(File.read(File.join(destination, "index.html")))
    html.css("#latest-tools .home-tool-gallery > li > a").map { |link| link["href"] }
  end
end

def assert_urls(expected, tools)
  actual = rendered_tool_urls(tools)
  raise "Attendu #{expected.inspect}, obtenu #{actual.inspect}" unless expected == actual
end

def tool(slug, date)
  { "name" => slug, "url" => "/outils/#{slug}/", "created_at" => date }
end

same_date = "2026-10-25T01:17:40Z"
tools = [
  tool("tie-c", same_date),
  tool("old", "2026-10-23T17:11:59Z"),
  tool("tie-b", same_date),
  tool("latest", "2026-10-28T00:16:29Z"),
  tool("tie-a", same_date)
]
expected = %w[/outils/latest/ /outils/tie-a/ /outils/tie-b/]
[tools, tools.reverse, tools.rotate(2)].each { |order| assert_urls(expected, order) }
assert_urls(["/outils/tie-a/"], [tools.last])
assert_urls([], [])
puts "Accueil : ordre chronologique et égalités déterministes pour les outils : OK."
