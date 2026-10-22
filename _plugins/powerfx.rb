require "rouge"

module Rouge
  module Lexers
    class PowerFx < RegexLexer
      title "Power Fx"
      desc "Microsoft Power Fx formulas"
      tag "powerfx"
      aliases "power-fx"
      filenames "*.fx"

      state :root do
        rule %r{//[^\n]*}, Comment::Single
        rule %r{/\*.*?\*/}m, Comment::Multiline
        rule %r{\$?"(?:[^"]|"")*"}, Str::Double
        rule %r{'(?:[^']|'')*'}, Name::Variable
        rule %r{\b(?:true|false|Blank)\b}i, Keyword::Constant
        rule %r{\b(?:As|And|Or|Not|in|exactin|Self|Parent|ThisItem|ThisRecord)\b}i, Keyword
        rule %r{\b[A-Za-z_]\w*(?=\s*\()}, Name::Function
        rule %r{\b\d+(?:\.\d+)?\b}, Num
        rule %r{[+\-*/=&<>!]+}, Operator
        rule %r{[(){}\[\];:,.]}, Punctuation
        rule %r{\s+}, Text
        rule %r{[^+\-*/=&<>!(){}\[\];:,.\s]+}, Name
      end
    end
  end
end
