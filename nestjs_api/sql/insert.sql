use restaurant;

insert into roles(name)
values ('ADMIN');

insert into roles(name)
values ('MANAGER');

insert into roles(name)
values ('CLIENT');

insert into roles(name)
values ('GUEST');

insert into statuses(name)
values ('CREATED');

insert into statuses(name)
values ('AWAITING');

insert into statuses(name)
values ('CANCELED');

insert into statuses(name)
values ('PREPARING');

insert into statuses(name)
values ('READY');

insert into statuses(name)
values ('NOT_PAID');

insert into statuses(name)
values ('FINISHED');

begin
    declare @login varchar(max) = 'admin';
    declare @password varchar(max) = '$2b$10$80MiPAklihkYXtUch6.PL.kN3DlrAhgkRN0P1qAoAQg3rENmQnxhi';
    declare @name varchar(max) = 'admin';
    declare @email varchar(max) = 'admin@gmail.com';
    declare @phone varchar(max) = null;
    declare @blocked bit = 1;
    declare @role_id bigint;
    declare @status_id bigint;
    declare @user_id bigint;
    declare @order_id bigint;
    select @role_id = id
    from roles
    where name = 'ADMIN';
    select @status_id = id
    from statuses
    where name = 'CREATED';
    insert into users(login, password, name, email, phone, blocked, role_id)
    values (@login, @password, @name, @email, @phone, @blocked, @role_id);
    select @user_id = id
    from users
    where login = @login;
    insert into orders(status_id, customer_id)
    values (@status_id, @user_id);
    select @order_id = id
    from orders
    where status_id = @status_id
      and customer_id = @user_id;
    update users
    set order_id = @order_id
    where id = @user_id;
end;

select *
from users;
select *
from roles;
select *
from addresses;
select *
from dishes;
select *
from categories;
select *
from orders;
select *
from statuses;
select *
from order_items;
select *
from reviews;