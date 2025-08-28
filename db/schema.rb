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

ActiveRecord::Schema[7.2].define(version: 2025_08_28_130235) do
  create_table "cats", charset: "utf8mb4", force: :cascade do |t|
    t.string "name"
    t.string "breed"
    t.integer "age"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "dog_supporters", charset: "utf8mb4", force: :cascade do |t|
    t.bigint "dog_id", null: false, unsigned: true
    t.bigint "supporter_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dog_id"], name: "index_dog_supporters_on_dog_id"
    t.index ["supporter_id"], name: "index_dog_supporters_on_supporter_id"
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

  create_table "supporters", charset: "utf8mb4", force: :cascade do |t|
    t.string "email", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "dog_supporters", "dogs", name: "index_dog_supporters_on_dog_id"
  add_foreign_key "dog_supporters", "supporters"
end
