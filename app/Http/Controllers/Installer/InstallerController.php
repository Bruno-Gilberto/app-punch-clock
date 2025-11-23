<?php

namespace App\Http\Controllers\Installer;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\Controller;

class InstallerController extends Controller
{

    public function index()
    {
        // 1. Verificar se a aplicação já está instalada (ex: checar APP_KEY)
        if (env('APP_INSTALLED')) return redirect('/');        

        // 2. Mostrar a view do instalador
        $phpversion = phpversion();
        $mbstring = extension_loaded('mbstring');
        $bcmath = extension_loaded('bcmath');
        $ctype = extension_loaded('ctype');
        $json = extension_loaded('json');
        $openssl = extension_loaded('openssl');
        $pdo = extension_loaded('pdo');
        $tokenizer = extension_loaded('tokenizer');
        $xml = extension_loaded('xml');

        $extentions = [
            'mbstring' => $mbstring,
            'bcmath' => $bcmath,
            'ctype' => $ctype,
            'json' => $json,
            'openssl' => $openssl,
            'pdo' => $pdo,
            'tokenizer' => $tokenizer,
            'xml' => $xml,
        ];

        return view('installer.requirements', compact('extentions'));
    }

    public function show()
    {
        // 1. Verificar se a aplicação já está instalada (ex: checar APP_KEY)
        if (env('APP_INSTALLED')) return redirect('/');

        return view('installer.show');
    }

    public function store(Request $request)
    {
        // 1. Validação dos dados do banco de dados (host, user, pass)
        $validated = $request->validate([
            'db_host' => 'required|string',
            'db_port' => 'required|numeric',
            'db_name' => 'required|max:50',
            'db_user' => 'required|max:50',
            'db_pass' => 'nullable|max:50',
        ]);

        // 2. Configurar temporariamente os dados para teste
        config([
            'database.connections.mysql.host' => $validated['db_host'],
            'database.connections.mysql.port' => $validated['db_port'],
            'database.connections.mysql.database' => $validated['db_name'],
            'database.connections.mysql.username' => $validated['db_user'],
            'database.connections.mysql.password' => $validated['db_pass'],
        ]);
        
        // 3. Testar a conexão com o banco de dados (OPCIONAL, mas recomendado)
        try {
            DB::purge('mysql'); // Limpa o cache de conexão
            if(!DB::connection('mysql')->getPdo()){
                return response()->json(['message'=>'Não foi possível conectar ao banco de dados. Verifique sua configuração.'], 500);
            }
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message'=>"Não foi possível conectar ao banco de dados. Verifique sua configuração. Erro: $errorMessage"],401);
        }

        // 6. Finalizar e redirecionar
        return response()->json(['message'=>'Aplicação instalada com sucesso', 'update_env' => $this->updateEnvFile($validated)], 200);
    }

    public function migrate()
    {
        ini_set('max_execution_time', 0);

        try {
            Artisan::call('migrate:fresh', [
                '--force' => true,
            ]);

            Artisan::call('db:seed',[
                '--force' => true,
            ]);

            return response()->json(['message'=>'Instalação concluída com sucesso', 'redirect'=> url('install/congratulations')]);
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();
            return response()->json(['message'=>"Falha na migração: $errorMessage"], 500);
        }
    }

    public function congratulations()
    {
        // 1. Verificar se a aplicação já está instalada (ex: checar APP_KEY)
        if (!env('APP_INSTALLED')) return redirect('/');

        return view('installer.congratulations');
    }

    /**
     * Helper para atualizar o arquivo .env (requer permissões de escrita)
     */
    private function updateEnvFile($data)
    {
        $path = base_path('.env');
        if (File::exists($path)) {
            $content = file_get_contents($path);
            
            // Substitui os valores no .env
            $content = preg_replace('/^APP_INSTALLED=.*$/m', "APP_INSTALLED=true", $content);
            $content = preg_replace('/^DB_HOST=.*$/m', "DB_HOST={$data['db_host']}", $content);
            $content = preg_replace('/^DB_DATABASE=.*$/m', "DB_DATABASE={$data['db_name']}", $content);
            $content = preg_replace('/^DB_USERNAME=.*$/m', "DB_USERNAME={$data['db_user']}", $content);
            $content = preg_replace('/^DB_PASSWORD=.*$/m', "DB_PASSWORD={$data['db_pass']}", $content);
            
            File::put($path, $content);
            return true;
        }
    }
}
