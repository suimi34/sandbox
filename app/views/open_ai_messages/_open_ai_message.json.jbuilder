json.extract! open_ai_message, :id, :created_at, :updated_at
json.url open_ai_message_url(open_ai_message, format: :json)
