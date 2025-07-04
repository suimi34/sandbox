# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_06_29_024152) do
  create_table "cats", charset: "utf8mb4", force: :cascade do |t|
    t.string "name"
    t.string "breed"
    t.integer "age"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "dogs", id: { type: :bigint, unsigned: true }, charset: "utf8mb4", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "open_ai_messages", charset: "utf8mb4", force: :cascade do |t|
    t.text "content", null: false
    t.string "thread_id", null: false
    t.string "run_id"
    t.text "response"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
