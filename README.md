# Inuktag

An atom plugin for creating the %mor tier of CHAT transcriptions.

# Installing

After installing Atom, look for its `.atom` folder. In Windows, it is probably
in `C:/Users/<your_user_name>/.atom`; in Linux, it is probably in
`/home/<your_user_name>/.atom`.

Download the entire code into a folder called `inuktag` inside
`.atom/packages/`. The code needs the dictionary containing the morphemes and
the corresponding glosses (they are not included here to prevent copyright
issues). It should be located in `/lib/data/dict.txt`.

Now just open Atom and the plugin should be accessible.

# Using

The file `keymaps/inuktag.json` contains the keyboard shortcuts for the
functionalities provided by the plugin. By default, they are:

 * ctrl+shift+space: Tags current morpheme
 * ctrl+enter: Copies the current line into a %mor tier

