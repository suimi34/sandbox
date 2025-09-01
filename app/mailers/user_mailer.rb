class UserMailer < ApplicationMailer
  default from: ENV.fetch('SERVICE_DOMAIN', nil)

  def welcome_email(user)
    @user = user
    mail(to: @user.email, subject: 'Welcome to My Awesome Site')
  end
end
