Rails.application.routes.draw do
  namespace :admin do
    resources :cats
    resources :dogs
    resources :open_ai_messages

    root to: 'cats#index'
  end
  mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: '/graphql' if Rails.env.development?
  post '/graphql', to: 'graphql#execute'

  resources :cats
  resources :dogs
  resources :open_ai_messages
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root 'dogs#index'
end
