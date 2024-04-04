require 'rails_helper'

RSpec.describe "Dogs", type: :request do
  describe "idnex" do
    it "" do
      get dogs_path
      expect(response).to have_http_status(200)
    end
  end
end
