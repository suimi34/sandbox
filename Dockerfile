FROM ruby:3.2.2

ENV ROOT="/sandbox"
ENV LANG=C.UTF-8
ENV TZ=Asia/Tokyo
ENV RAILS_ENV=development

WORKDIR ${ROOT}

COPY Gemfile Gemfile.lock ${ROOT}/

RUN gem install bundler -v 2.6.8 && bundle install

COPY . ${ROOT}
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]
