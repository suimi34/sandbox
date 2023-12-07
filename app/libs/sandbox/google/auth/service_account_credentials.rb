# fronzen_string_literal: true

module Sandbox::Google::Auth
  class ServiceAccountCredentials
    include Singleton

    def initialize
      Google::Auth::ServiceAccountCredentials.make_creds(
        json_key_io: File.open(Rails.root.join('config/gcp/sandbox-dev-407109-4f24888ddff1.json')),
        scope: ['https://www.googleapis.com/auth/firebase', 'https://www.googleapis.com/auth/cloud-platform']
      )
    end
  end
end
