
<div>
  @if (Auth::check())
    <a href="/dashboard">Dashboard</a>
  @endif
  <a href="/introduction">Introduction</a>
  @if (Auth::check())
    <a href="/user">User</a>
    @if (Auth::User()->role==1)
      <a href='/admin'>Admin</a>
    @endif
    <form method="post" action="/logout" style="display:inline;">
      @csrf
      <input type="submit" value="Logout">
    </form>
  @endif
</div>
