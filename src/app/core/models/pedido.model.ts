import { Producto } from './producto.model';

export interface DetallePedido {
    id?: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;      // precio al momento de comprar
    producto?: Producto;
}

export interface Pedido {
    id?: number;
    user_id?: number;
    estado: 'Pendiente' | 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado';
    estado_pago: 'Pagado' | 'Pendiente de Pago';
    metodo_pago: 'Tarjeta' | 'Transferencia' | 'Efectivo';
    total: number;
    direccion_envio: string;
    created_at?: string;          // fecha del pedido
    detalles?: DetallePedido[];
    user?: { id: number; name: string; email: string };
}
