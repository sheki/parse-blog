eval "$(/opt/homebrew/bin/brew shellenv)"
alias ls='ls --color=auto'
eval "$(starship init zsh)"
PATH="/opt/homebrew/opt/coreutils/libexec/gnubin:$PATH"
PATH="/Users/sheki/budget/iosapp/flutter:$PATH"
PATH="/Users/sheki/go/bin:$PATH"

# Created by `pipx` on 2024-11-12 01:50:43
export PATH="$PATH:/Users/sheki/.local/bin"
fpath+=~/.zfunc
autoload -Uz compinit && compinit
source <(fzf --zsh)

export FZF_CTRL_R_OPTS="
  --bind 'ctrl-y:execute-silent(echo -n {2..} | pbcopy)+abort'
  --color header:italic
  --header 'Press CTRL-Y to copy command into clipboard'"


# bun completions
[ -s "/Users/sheki/.bun/_bun" ] && source "/Users/sheki/.bun/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Added by Windsurf
export PATH="/Users/sheki/.codeium/windsurf/bin:$PATH"

export PATH="/Users/sheki/bin:$PATH"
eval "$(zoxide init zsh)"
export PATH=~/.npm-global/bin:$PATH
alias claude="/Users/sheki/.claude/local/claude"

# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/sheki/Downloads/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/sheki/Downloads/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/sheki/Downloads/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/sheki/Downloads/google-cloud-sdk/completion.zsh.inc'; fi

# pnpm
export PNPM_HOME="/Users/sheki/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
# pnpm end
