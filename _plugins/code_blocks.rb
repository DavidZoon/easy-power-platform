# frozen_string_literal: true

# Adds a language label and a copy button toolbar to Rouge code blocks at build time,
# so the toolbar is part of the initial HTML (no layout shift) and visible without JavaScript.
module EasyPowerPlatform
  module CodeBlocks
    LABELS = {
      'powerfx' => 'Power Fx',
      'yaml' => 'YAML',
      'yml' => 'YAML',
      'json' => 'JSON',
      'javascript' => 'JavaScript',
      'js' => 'JavaScript',
      'typescript' => 'TypeScript',
      'powershell' => 'PowerShell',
      'ps1' => 'PowerShell',
      'csharp' => 'C#',
      'cs' => 'C#',
      'html' => 'HTML',
      'xml' => 'XML',
      'css' => 'CSS',
      'sql' => 'SQL',
      'bash' => 'Bash',
      'shell' => 'Shell',
      'text' => 'Texte',
      'plaintext' => 'Texte'
    }.freeze

    PATTERN = /<div class="language-([\w-]+) highlighter-rouge"><div class="highlight">/

    def self.label(language)
      LABELS.fetch(language.downcase) { language.upcase }
    end

    def self.decorate(html)
      html.gsub(PATTERN) do
        language = Regexp.last_match(1)
        label = label(language)
        %(<div class="code-block language-#{language} highlighter-rouge">) +
          %(<div class="code-toolbar"><span class="code-lang">#{label}</span>) +
          %(<button type="button" class="code-copy" hidden aria-label="Copier le code #{label}">Copier</button></div>) +
          %(<div class="highlight">)
      end
    end
  end
end

Jekyll::Hooks.register [:documents, :pages], :post_render do |item|
  next unless item.output_ext == '.html' && item.output&.include?('highlighter-rouge')

  item.output = EasyPowerPlatform::CodeBlocks.decorate(item.output)
end
