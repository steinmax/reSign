﻿using ReSign.Database.Logic.DataContext;

Console.WriteLine("Hello");

using var context = new BaseDbContext();
context.RoomSet.ToList().ForEach(r => Console.WriteLine(r));