# All Administrate controllers inherit from this
# `Administrate::ApplicationController`, making it the ideal place to put
# authentication logic or other before_actions.
#
# If you want to add pagination or other controller-level concerns,
# you're free to overwrite the RESTful controller actions.
module Admin
  class ApplicationController < Administrate::ApplicationController
    before_action :authenticate_admin, if: :production?

    def authenticate_admin
      authenticate_or_request_with_http_basic('Admin') do |username, password|
        username == admin_username && password == admin_password
      end
    end

    private

    def production?
      Rails.env.production?
    end

    def admin_username
      Rails.application.credentials.admin_username || ENV.fetch('ADMIN_USERNAME', nil)
    end

    def admin_password
      Rails.application.credentials.admin_password || ENV.fetch('ADMIN_PASSWORD', nil)
    end

    # Override this value to specify the number of elements to display at a time
    # on index pages. Defaults to 20.
    # def records_per_page
    #   params[:per_page] || 20
    # end
  end
end
