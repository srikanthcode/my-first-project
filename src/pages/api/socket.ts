import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/lib/socket-server';
import { initSocket } from '@/lib/socket-server';

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (!res.socket.server.io) {
        console.log('Initializing Socket.IO server...');

        const httpServer = res.socket.server;
        const io = initSocket(httpServer);

        res.socket.server.io = io;
        console.log('Socket.IO server initialized');
    } else {
        console.log('Socket.IO server already running');
    }

    res.status(200).json({ success: true });
}
