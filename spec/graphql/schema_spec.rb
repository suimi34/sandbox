require 'rails_helper'

RSpec.describe 'SandboxlSchema' do
  let(:current_definition) { SandboxSchema.to_definition }
  let(:printout_definition) { File.read(Rails.root.join('docs/schema.graphql')) }

  it 'equals dumped schema, `rake graphql:schema:dump` please!' do
    expect(current_definition).to eq(printout_definition)
  end
end
