# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@firebase/database", to: "@firebase--database.js" # @1.0.4
pin "@firebase/app", to: "@firebase--app.js" # @0.10.2
pin "@firebase/component", to: "@firebase--component.js" # @0.6.6
pin "@firebase/logger", to: "@firebase--logger.js" # @0.4.1
pin "@firebase/util", to: "@firebase--util.js" # @1.9.5
pin "idb" # @7.1.1
