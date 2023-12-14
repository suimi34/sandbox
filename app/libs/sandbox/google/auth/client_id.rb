# fronzen_string_literal: true

module Sandbox::Google::Auth
  class ClientId
    include Singleton

    def initialize
      Google::Auth::ClientId.new(ENV.fetch('GOOGLE_OAUTH2_CLIENT_ID'), ENV.fetch('GOOGLE_OAUTH2_CLIENT_SECRET'))
    end
  end
end
