document.addEventListener('DOMContentLoaded', event => {
    console.log("entro en la pagina")

    document.getElementById("btn_con").addEventListener("click", connect)
    document.getElementById("btn_dis").addEventListener("click", disconnect)
    document.getElementById("btn_move").addEventListener("click", move)
    document.getElementById("btn_stop").addEventListener("click", stop)
    document.getElementById("btn_change_direction").addEventListener("click", changeDirection)
    document.getElementById("btn_toggle_cage").addEventListener("click", toggleCage)

    let data = {
        // ros connection
        ros: null,
        rosbridge_address: 'ws://127.0.0.1:9090/',
        connected: false,
        // flag to track current direction
        direction: 'forward', // 'forward' or 'backward'
        // variable to store position data
        position: {
            x: 0,
            y: 0
        },
        // cage mode flag
        cageMode: false,
        // cage vertices
        cageVertices: [
            { x: -1.5, y: -0.5 },
            { x: -1.5, y: -1.5 },
            { x: -2.5, y: -0.5 },
            { x: -2.5, y: -1.5 }
        ]
    }

    function toggleCage() {
        data.cageMode = !data.cageMode;
        console.log("Cage mode toggled:", data.cageMode ? "On" : "Off");
    }

    function move() {
        // If not in cage mode, move normally
        if (!data.cageMode) {
            console.log("Moving...");
            // Add your move logic here
        } else {
            console.log("Moving within cage...");
            // Implement move logic within cage here
            // For demonstration purposes, let's just print a message
        }
    }

    function connect(){
        console.log("Clic en connect")

        data.ros = new ROSLIB.Ros({
            url: data.rosbridge_address
        })

        // Define callbacks
        data.ros.on("connection", () => {
            data.connected = true
            console.log("Conexion con ROSBridge correcta")
        })
        data.ros.on("error", (error) => {
            console.log("Se ha producido algun error mientras se intentaba realizar la conexion")
            console.log(error)
        })
        data.ros.on("close", () => {
            data.connected = false
            console.log("Conexion con ROSBridge cerrada")            
        })

        // Subscribe to topic /odom
        let topic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/odom',
            messageType: 'nav_msgs/msg/Odometry'
        })

        topic.subscribe((message) => {
            data.position = message.pose.pose.position
            document.getElementById("pos_x").innerHTML = data.position.x.toFixed(2)
            document.getElementById("pos_y").innerHTML = data.position.y.toFixed(2)
        })
    }

    function disconnect(){
        data.ros.close()        
        data.connected = false
        console.log('Clic en botón de desconexión')
    }   

    function stop() {
        let topic = new ROSLIB.Topic({
            ros: data.ros,
            name: '/cmd_vel',
            messageType: 'geometry_msgs/msg/Twist'
        })

        // Sending zero velocities to stop the robot
        let message = new ROSLIB.Message({
            linear: {x: 0, y: 0, z: 0 },
            angular: {x: 0, y: 0, z: 0 },
        })
        topic.publish(message)
    }

    function changeDirection() {
        // Toggle between forward and backward directions
        if (data.direction === 'forward') {
            data.direction = 'backward';
            console.log('Direction changed to backward');
        } else {
            data.direction = 'forward';
            console.log('Direction changed to forward');
        }
    }

});