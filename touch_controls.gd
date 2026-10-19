extends Control

# These on-screen buttons trigger Godot's built-in directional actions.
# The same player controller can therefore use touch or a keyboard.

func _ready() -> void:
	_bind_button("UpButton", "ui_up")
	_bind_button("DownButton", "ui_down")
	_bind_button("LeftButton", "ui_left")
	_bind_button("RightButton", "ui_right")

func _bind_button(button_name: String, action_name: String) -> void:
	var button := get_node_or_null(button_name) as Button
	if button == null:
		push_warning("Touch control button not found: " + button_name)
		return

	button.button_down.connect(func() -> void:
		Input.action_press(action_name)
	)
	button.button_up.connect(func() -> void:
		Input.action_release(action_name)
	)
