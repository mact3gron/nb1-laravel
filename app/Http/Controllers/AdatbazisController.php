<?php

namespace App\Http\Controllers;

use App\Models\Klub;
use App\Models\Labdarugo;
use App\Models\Poszt;
use Illuminate\View\View;

class AdatbazisController extends Controller
{
    public function index(): View
    {
        $klubok = Klub::query()
            ->withCount('labdarugok')
            ->orderBy('csapatnev')
            ->paginate(10, ['*'], 'klub_page');

        $labdarugok = Labdarugo::query()
            ->with([
                'klub:id,csapatnev',
                'poszt:id,nev',
            ])
            ->orderBy('vezeteknev')
            ->orderBy('utonev')
            ->paginate(15, ['*'], 'jatekos_page');

        $posztok = Poszt::query()
            ->orderBy('nev')
            ->paginate(10, ['*'], 'poszt_page');

        return view('adatbazis', [
            'klubok' => $klubok,
            'labdarugok' => $labdarugok,
            'posztok' => $posztok,
        ]);
    }
}