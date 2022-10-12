import dotenv from 'dotenv';

// Import the app
import { app } from './app';

dotenv.config();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server running on port ' + port);
    if (process.env.NODE_ENV === 'development') {
        console.log('http://localhost:' + port);
    }
});
