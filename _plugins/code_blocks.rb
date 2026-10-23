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
        powerfx = %w[powerfx power-fx powerfx-comma powerfx-semicolon].include?(language)
        label = powerfx ? 'Power Fx' : label(language)
        source = language.delete_prefix('powerfx-')
        attribute = powerfx ? %( data-powerfx="#{source}") : ''
        control = if powerfx
                    %(<label class="code-separator" data-powerfx-control hidden>Séparateur d’arguments ) +
                      %(<select data-powerfx-select><option value="comma">Virgule (,)</option>) +
                      %(<option value="semicolon">Point-virgule (;)</option></select></label>)
                  else
                    ''
                  end
        %(<div class="code-block language-#{language} highlighter-rouge"#{attribute}>) +
          %(<div class="code-toolbar"><span class="code-lang">#{label}</span>) +
          control +
          %(<button type="button" class="code-copy" hidden aria-label="Copier le code #{label}">Copier</button></div>) +
          (powerfx ? %(<p class="code-syntax-status" data-powerfx-status role="status" hidden></p>) : '') +
          %(<div class="highlight">)
      end
    end
  end
end

Jekyll::Hooks.register [:documents, :pages], :post_render do |item|
  next unless item.output_ext == '.html' && item.output&.include?('highlighter-rouge')

  item.output = EasyPowerPlatform::CodeBlocks.decorate(item.output)
end
