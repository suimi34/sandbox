# fronzen_string_literal: true

module Sandbox::Google::Auth
  class UserAuthorizer
    include Singleton

    def initialize
      Google::Auth::UserAuthorizer.new(
        ::Sandbox::Google::Auth::ClientId.instance,
        ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
        nil,
        ENV.fetch('GOOGLE_OAUTH2_REDIRECT_URI')
      )
    end
  end
end
