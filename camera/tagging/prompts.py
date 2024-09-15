def get_space_prompt():
    return """Analyze the provided image of an indoor space, focusing on the following:
1. List the contents of any visibly-posted signage (for example, the poster says Check-In Here)
2. Activity occuring in the room (for example, students are seated at desks taking an exam)
3. Aesthetics of the room (for example, the room is dimly lit by a red neon sign)

DO NOT focus on any minor, individual objects within the room (people, chairs, etc). Instead, focus on the abstract nature of the room based on signage and activity.
DO NOT refer to the room as anything. For example, instead of saying "The room has a modern and spacious interior" say "Modern and spacious".

Be as concise as possible. For example, instead of saying "The room is quite lively, with people engaging in what seems to be a networking or exhibition event." say "Lively networking or exhibition".

Your response should be 1-5 sentences based on image content."""

def get_object_prompt(object):
    return f"""Analyze the provided image of a(n) {object}, focusing on the following:
1. Visually-identifying information about the object (for example, if a person is wearing a hat or the color of a chair is red)
2. Contextual information about the object (for example, the person is sitting at their laptop, or the chair is a reclined armchair)
3. Any visible text or signage on the object (for example, the title of the book is War and Peace)

DO NOT identify object location, position, or orientation. The only important details are visual characteristics regardless of where the object is positioned in-frame or facing.
DO NOT describe anything besides the object itself. For example, don't say "Background appears green".
DO NOT refer to the object as anything. For example, instead of saying "The chair is red and reclined" say "Red and reclined" since we already know what the object is.
DO NOT be ambigious in your response. For example, if you don't know exactly what they user is doing, don't say "appears to be focused or engaged in an action".

Be as concise as possible. For example, instead of saying "The person is wearing a gray t-shirt and black shorts, along with white socks and dark shoes. They have a black backpack slung over one shoulder" say "Wearing gray t-shirt, white socks, dark shoes, have black backpack".

ONLY answer with your response describing the object. Your response should be 1-4 sentences based on image content. Do not respond with anything besides the object's description."""
