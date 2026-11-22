<?php

namespace App\Http\Controllers;

use App\Models\Klub;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Validation\Rule;

class AdminKlubController extends Controller
{
    public function index(Request $request): View
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:100',
        ]);

        $search = trim((string) ($validated['search'] ?? ''));

        $klubok = Klub::query()
            ->select(['id', 'csapatnev'])
            ->withCount('labdarugok')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(
                    'csapatnev',
                    'like',
                    '%' . $search . '%'
                );
            })
            ->orderBy('csapatnev')
            ->paginate(10)
            ->withQueryString();

        return view('admin.klubok.index', compact('klubok', 'search'));
    }

    public function create(): View
    {
        return view('admin.klubok.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateKlub($request);

        try {
            Klub::create($validated);

            return redirect()
                ->route('admin.klubok.index')
                ->with('success', 'Az új klub sikeresen létrejött!');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('failed', 'Nem sikerült létrehozni a klubot!');
        }
    }

    public function edit(Klub $klub): View
    {
        return view('admin.klubok.edit', compact('klub'));
    }

    public function update(
        Request $request,
        Klub $klub
    ): RedirectResponse {
        $validated = $this->validateKlub($request, $klub);

        try {
            $klub->update($validated);

            return redirect()
                ->route('admin.klubok.index')
                ->with('success', 'A klub adatai sikeresen módosultak!');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('failed', 'Nem sikerült módosítani a klubot!');
        }
    }

    public function destroy(Klub $klub): RedirectResponse
    {
        if ($klub->labdarugok()->exists()) {
            return redirect()
                ->route('admin.klubok.index')
                ->with(
                    'failed',
                    'A klub nem törölhető, mert labdarúgók tartoznak hozzá!'
                );
        }

        try {
            $klub->delete();

            return redirect()
                ->route('admin.klubok.index')
                ->with('success', 'A klub sikeresen törölve!');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('failed', 'Nem sikerült törölni a klubot!');
        }
    }

    private function validateKlub(
        Request $request,
        ?Klub $klub = null
    ): array {
        $csapatnev = $request->input('csapatnev');

        if (is_string($csapatnev)) {
            $request->merge([
                'csapatnev' => trim($csapatnev),
            ]);
        }

        $uniqueRule = Rule::unique('klub', 'csapatnev');

        if ($klub !== null) {
            $uniqueRule->ignore($klub->id);
        }

        return $request->validate(
            [
                'csapatnev' => [
                    'required',
                    'string',
                    'min:2',
                    'max:255',
                    $uniqueRule,
                ],
            ],
            [
                'csapatnev.required' =>
                    'A klub nevének megadása kötelező.',

                'csapatnev.string' =>
                    'A klub neve szöveges érték legyen.',

                'csapatnev.min' =>
                    'A klub neve legalább 2 karakter legyen.',

                'csapatnev.max' =>
                    'A klub neve legfeljebb 255 karakter lehet.',

                'csapatnev.unique' =>
                    'Már létezik ilyen nevű klub.',
            ]
        );
    }
}