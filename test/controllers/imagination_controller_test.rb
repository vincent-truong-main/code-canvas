require "test_helper"

class ImaginationControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get imagination_index_url
    assert_response :success
  end

  test "should get create_ai_powered_image" do
    get imagination_create_ai_powered_image_url
    assert_response :success
  end
end
