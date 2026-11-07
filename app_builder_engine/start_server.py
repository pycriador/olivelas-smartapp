import socket
import os
import sys

def find_free_port(start_port=8000):
    port = start_port
    while port < start_port + 100:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.bind(('127.0.0.1', port))
                return port
            except OSError:
                port += 1
    return start_port

if __name__ == '__main__':
    app_env = os.getenv('APP_ENV', 'development').strip().lower()
    is_prod = app_env in ('production', 'prod')
    default_port = int(os.getenv('PORT') or os.getenv('API_PORT') or 8000)

    if is_prod:
        # Em produção: porta fixa rigorosa
        port = default_port
        host = os.getenv('API_HOST', '0.0.0.0')
        workers = os.getenv('WEB_CONCURRENCY', '2')
        print(f'🏭 [PRODUÇÃO] Iniciando FastAPI em porta fixa {port} (http://{host}:{port})')
        os.execv(sys.executable, [
            sys.executable, '-m', 'uvicorn', 'app.main:app',
            '--host', host,
            '--port', str(port),
            '--workers', str(workers)
        ])
    else:
        # Em desenvolvimento local: busca próxima porta livre se estiver ocupada
        port = find_free_port(default_port)
        if port != default_port:
            print(f'⚠️ Porta padrão {default_port} ocupada. Usando próxima porta livre: {port}')
        
        print(f'🚀 [DESENVOLVIMENTO] Iniciando FastAPI na porta {port} (http://127.0.0.1:{port})')
        with open('.backend_port', 'w') as f:
            f.write(str(port))
        
        os.execv(sys.executable, [
            sys.executable, '-m', 'uvicorn', 'app.main:app',
            '--host', os.getenv('API_HOST', '127.0.0.1'),
            '--port', str(port),
            '--reload'
        ])

