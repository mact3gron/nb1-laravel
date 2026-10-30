<?php
namespace App\Http\Controllers;

use App\Models\Labdarugo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LabdarugoController extends Controller
{
    public function index(Request $request): Response
    {
        // Keresési feltétel ellenőrzése
        $validated = $request->validate([
            'search' => 'nullable|string|max:100',
        ]);

        $search = trim($validated['search'] ?? '');

        // Labdarúgók lekérdezése
        $labdarugok = Labdarugo::query()
            ->with([
                'klub:id,csapatnev',
                'poszt:id,nev',
            ])

            // Keresés név, klub és poszt alapján
            ->when($search !== '', function ($query) use ($search) {
                $like = '%' . $search . '%';

                $query->where(function ($q) use ($like) {
                    $q->where('vezeteknev', 'like', $like)
                        ->orWhere('utonev', 'like', $like)
                        ->orWhereHas('klub', function ($klub) use ($like) {
                            $klub->where('csapatnev', 'like', $like);
                        })
                        ->orWhereHas('poszt', function ($poszt) use ($like) {
                            $poszt->where('nev', 'like', $like);
                        });
                });
            })

            // Rendezés
            ->orderBy('vezeteknev')
            ->orderBy('utonev')
            ->orderBy('id')

            // Lapozás
            ->paginate(15)
            ->withQueryString();

        // Adatok átadása a React felületnek
        return Inertia::render('labdarugok/index', [
            'labdarugok' => $labdarugok,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
