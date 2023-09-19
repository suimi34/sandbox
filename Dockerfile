FROM ruby:3.2.2-bullseye as builder

ENV ROOT="/sandbox"
WORKDIR ${ROOT}

COPY Gemfile Gemfile.lock ${ROOT}

RUN gem install bundler && bundle install --without test development

FROM ruby:3.2.2-bullseye as runner

ENV ROOT="/sandbox"
WORKDIR ${ROOT}
ENV LANG=C.UTF-8
ENV TZ=Asia/Tokyo
ARG DB_HOST
ENV DB_HOST=${DB_HOST}

COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY . ${ROOT}
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]
