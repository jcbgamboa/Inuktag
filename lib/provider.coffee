fs = require 'fs'

module.exports =
  # The `selector` variable chooses where this provider will work. With a star,
  # it will work for all files; probably I should use something like
  # "source.cha" in this provider.
  selector: '*'
  # The variable `disableForSelector` allows me to prevent the provider from
  # being activated in some parts of the file (unfortunately, I'd probably have
  # to create a syntax definition for the .cha files). In the example below, the
  # provider won't be activated in comment sections of ruby files.
  #disableForSelector: 'source.ruby .comment'

  # This will take priority over the default provider, which has a inclusionPriority of 0.
  # `excludeLowerPriority` will suppress any providers with a lower priority
  # i.e. The default provider will be suppressed
  inclusionPriority: 1
  excludeLowerPriority: true

  # This will be suggested before the default provider, which has a suggestionPriority of 1.
  suggestionPriority: 2

  load: (dict_data) ->
    @dict_data = dict_data

  getSuggestions: (options) ->
    { prefix, activatedManually } = options
    ret = @findMatchingSuggestions(prefix, activatedManually)
    return ret;

  findMatchingSuggestions: (prefix, activatedManually) ->
    matchingSuggestions = []

    if prefix.length > 4 or activatedManually
      matchingSuggestions = dict_data.filter((elem) -> elem[0].startsWith(prefix))
      console.log(matchingSuggestions);

    return matchingSuggestions.map(@inflateSuggestion);

  inflateSuggestion: (elem) -> { text: elem[1] }
