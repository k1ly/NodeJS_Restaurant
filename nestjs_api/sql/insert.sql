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

        do
    $$
declare
    v_login     text    = 'admin';
        v_password  text    = '$2b$10$80MiPAklihkYXtUch6.PL.kN3DlrAhgkRN0P1qAoAQg3rENmQnxhi';
        v_name      text    = 'admin';
        v_email     text    = 'admin@gmail.com';
        v_phone     text    = null;
        v_blocked   boolean = 1;
        v_role_id   bigint;
        v_status_id bigint;
        v_user_id   bigint;
        v_order_id  bigint;
begin
    select id
    into v_role_id
    from roles
    where name = 'ADMIN';
    select id
    into v_status_id
    from statuses
    where name = 'CREATED';
    insert into users(login, password, name, email, phone, blocked, role_id)
    values (v_login, v_password, v_name, v_email, v_phone, v_blocked, v_role_id);
    select id
    into v_user_id
    from users
    where login = v_login;
    insert into orders(status_id, customer_id)
    values (v_status_id, v_user_id);
    select id
    into v_order_id
    from orders
    where status_id = v_status_id
      and customer_id = v_user_id;
    update users
    set order_id = v_order_id
    where id = v_user_id;
end;
$$;

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