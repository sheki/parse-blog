return {
  -- add gruvbox
  { "ellisonleao/gruvbox.nvim" },
  { "bettervim/yugen.nvim" },
  { "EdenEast/nightfox.nvim" },
  { "rebelot/kanagawa.nvim" },
  -- Configure LazyVim to load gruvbox
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "dayfox",
      background = "light",
    },
  },
}
