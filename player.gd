extends CharacterBody3D

@export var move_speed: float = 5.0

func _physics_process(_delta: float) -> void:
	var input_dir := Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
	var direction := Vector3(input_dir.x, 0.0, input_dir.y)

	if direction.length_squared() > 1.0:
		direction = direction.normalized()

	velocity.x = direction.x * move_speed
	velocity.z = direction.z * move_speed

	if not is_on_floor():
		velocity.y -= 20.0 * _delta
	else:
		velocity.y = 0.0

	move_and_slide()
