# Inuktag

An atom plugin for creating the %mor tier of CHAT transcriptions.

# Installing

After installing Atom, look for its `.atom` folder. In Windows, it is probably
in `C:/Users/<your_user_name>/.atom`; in Linux, it is probably in
`/home/<your_user_name>/.atom`.

Download the entire code into a folder called `inuktag` inside
`.atom/packages/`. The code needs the dictionary containing the morphemes and
the corresponding glosses (they are not included here to prevent copyright
issues). You should put it in `inuktag/lib/data/dict.txt`.

Now just open Atom and the plugin should be accessible.

# Using

The file `keymaps/inuktag.json` contains the keyboard shortcuts for the
functionalities provided by the plugin. By default, they are:

 * ctrl+shift+space: Tags current morpheme
 * ctrl+i: Copies the current line into a %mor tier
 * ctrl+shift+e: Shows dictionary

(actually, these functions are not doing a lot so far. Hopefully they will soon)

## Comment on the `ctrl+i` functionality

Atom by defaults uses "soft tabs", by which it shows the characters as if they
were tabs, but actually inserts space characters in the files. This may break
the `ctrl+i` functionality (because CHAT files really need to have a tab
character after the beginning of the line, i.e., `%mor:` part).

To prevent this from happening, it may be a good idea to deactivate the
`soft tabs` in the Settings, in Atom. You may open the Settings going to
`Edit > Preferences`. Then click in `Editor` (in the left panel) and search
for the option named `Tab Type`. Then choose `hard` to deactivate `soft tabs`.

