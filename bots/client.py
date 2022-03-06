import socketio

sio = socketio.Client()
sio.connect('http://localhost:3000')

selfID = 0

@sio.event
def connect(sid, environ, auth):
    print('connect ', sid)
    selfID = sid
    
@sio.event
def disconnect(sid):
    print('disconnect ', sid)
    
    
@sio.on('*')
def catch_all(event, data):
    print(event)
    print(data)
    
    
sio.emit('newPlayer', {'position_x': 11, 'position_y': 11})