<?php

namespace App\Http\Controllers;

use App\Models\Klub;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KlubController extends Controller
{
    /**
     * Klubok listázása, keresése és lapozása.
     */
    public function index(Request $request): Response
    {
        // Keresési paraméter ellenőrzése
        $validated = $request->validate([
            'search' => 'nullable|string|max:100',
        ]);

        $search=trim(validated['search'] ?? '');

        // Klubok lekérdezése
        $klubok = Klub::query()
            ->select(['id', 'csapatnev'])
            ->when(search!=='',function($query) use ($search) {
                $query->where(
                    'csapatnev',
                    'like',
                    '%' . $search . '%'
                );
            })
            ->orderBy('csapatnev')
            ->paginate(10)
            ->withQueryString();

        // Adatok átadása a React oldalnak
        return Inertia::render('klubok/index', [
            'klubok' => $klubok,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
