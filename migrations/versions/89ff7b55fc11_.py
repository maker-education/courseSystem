"""empty message

Revision ID: 89ff7b55fc11
Revises: 11dea613243c
Create Date: 2016-04-20 15:23:13.185361

"""

# revision identifiers, used by Alembic.
revision = '89ff7b55fc11'
down_revision = '11dea613243c'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_foreign_key(None, 'groups_users', 'group', ['group_id'], ['id'])
    op.create_foreign_key(None, 'groups_users', 'user', ['user_id'], ['id'])
    op.create_foreign_key(None, 'post', 'user', ['user_id'], ['id'])
    op.create_foreign_key(None, 'roles_users', 'role', ['role_id'], ['id'])
    op.create_foreign_key(None, 'roles_users', 'user', ['user_id'], ['id'])
    op.create_foreign_key(None, 'user', 'group', ['own_group_id'], ['id'])
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'user', type_='foreignkey')
    op.drop_constraint(None, 'roles_users', type_='foreignkey')
    op.drop_constraint(None, 'roles_users', type_='foreignkey')
    op.drop_constraint(None, 'post', type_='foreignkey')
    op.drop_constraint(None, 'groups_users', type_='foreignkey')
    op.drop_constraint(None, 'groups_users', type_='foreignkey')
    ### end Alembic commands ###
