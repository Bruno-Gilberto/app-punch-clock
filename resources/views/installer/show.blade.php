@extends('installer.app')
@section('content')
@php
    $enabled=true;
@endphp
<div class="col-sm-12">
   <h3 class="text-center mt-2">{{ __('Insira as credenciais do banco de dados') }}</h3>
   <form class="installer_form_instant_reload" method="post" action="{{ route('install.store') }}">
      @csrf
        <div class="form-row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>{{ __('Host do banco de dados') }}</label>
                    <input type="text" name="db_host" class="form-control" required="" placeholder="localhost" maxlength="20" value="localhost">
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>{{ __('Porta do banco de dados') }}</label>
                    <input type="number" name="db_port" class="form-control" required="" placeholder="3306" maxlength="20" value="3306">
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>{{ __('Nome do banco de dados') }}</label>
            <input type="text" name="db_name" class="form-control" required="" placeholder="insira o nome do banco de dados">
        </div>
        <div class="form-group">
            <label>{{ __('Nome de usuário do banco de dados') }}</label>
            <input type="text" name="db_user" class="form-control" required="" placeholder="insira o nome de usuário do banco de dados">
        </div>
        <div class="form-group">
            <label>{{ __('Senha do banco de dados') }}</label>
            <input type="text" name="db_pass" class="form-control"  placeholder="insira a senha do banco de dados">
            <small>{{ __('Note:') }} <span class="text-danger">{{ __('Não use o caractere hash(#)') }}</span></small>
        </div>
        <div class="alert alert-primary alert-dismissible fade hide none waiting-bar" role="alert">
            <span class="alert-icon">📣</span>
            <span class="alert-text"><strong>{{ __('Nota: ') }}</strong> {{ __('Isso levará alguns instantes. Não feche esta aba.') }}</span>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">×</span>
            </button>
        </div>
      <button class="btn btn-outline-primary mt-1 submit-btn">
      <span class="mb-1">{{ __('Enviar') }}</span> 
      <i class="fi  fi-rs-angle-right text-right mt-5"></i>
      </button>
      <a href="https://youtu.be/TAbs7tba5kE" target="_blank" class="float-right">
         <h4 class="text-primary">{{ __('Como criar um banco de dados?') }}</h4>
      </a>
   </form>
</div>
<div class="clear"></div>
<br>
<form method="post" action="{{ route('install.migrate') }}" id="install-migrate">@csrf</form>
@endsection
@push('js')
<script src="{{ asset('assets/js/installer.js?v=1') }}"></script>
@endpush
