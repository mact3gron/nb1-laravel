<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function adminPage(Request $request)
    {
        if ($request->user()->role == 1)
            return view('admin');
        else
            return redirect('user');
    }
}
