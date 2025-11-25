<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{
    Hash,
    Auth
};
use App\Http\Controllers\Controller;

class Dashboard extends Controller
{
    public function show(Request $request)
    {
        return Inertia::render('Admin/Dashboard');
    }

    public function profile(Request $request)
    {
        $user = Auth::guard('admin')->user();

        return Inertia::render('Admin/Profile', [
            'user' => $user
        ]);
    }

    public function updateProfile(Request $request, Admin $admin)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'tax_id' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'occupation' => 'required|string|max:255',
            'zipcode' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'state' => 'required|string|max:255|size:2',
            'city' => 'required|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users_admin,email,' . $admin->id,
        ], [
            'name.required' => 'O nome é obrigatório',
            'email.required' => 'O email é obrigatório',
            'email.email' => 'Digite um email válido',
            'email.unique' => 'Este email já está cadastrado',
            'birth_date.required' => 'A data de nascimento é obrigatória',
            'birth_date.date' => 'Digite uma data válida',
            'occupation.required' => 'O cargo é obrigatório',
            'zipcode.required' => 'O CEP é obrigatório',
            'street.required' => 'A rua é obrigatória',
            'neighborhood.required' => 'O bairro é obrigatório',
            'city.required' => 'A cidade é obrigatória',
            'state.required' => 'O estado é obrigatório',
            'state.size' => 'O estado deve ter 2 caracteres',
        ]);

        $admin->update($validated);

        return redirect()->back()->with('success', 'Perfil atualizado com sucesso.');
    }

    public function changePassword(Request $request, Admin $admin)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6',
            'confirm_password' => 'required|string|min:6|same:new_password',
        ], [
            'current_password.required' => 'Digite sua senha atual',
            'new_password.required' => 'Digite a nova senha',
            'new_password.min' => 'A nova senha deve ter pelo menos 6 caracteres',
            'confirm_password.required' => 'Confirme a nova senha',
            'confirm_password.min' => 'A confirmação deve ter pelo menos 6 caracteres',
        ]);

        if (!Hash::check($validated['current_password'], $admin->password)) return redirect()->back()->withErrors(['current_password' => 'A senha atual está incorreta.']);

        $admin->update([
            'password' =>bcrypt($validated['new_password']),
        ]);

        return redirect()->back()->with('success', 'Senha alterada com sucesso.');
    }
}
