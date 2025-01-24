from rest_framework.decorators import api_view
from rest_framework.response import Response
from onboarding.models import get_user_role_string

@api_view(['GET'])
def is_user_authenticated(request):
    user = request.user
    # Check if the user is authenticated
    if user.is_authenticated:
        # User is authenticated
        if user.whitelevel_id is None:
            company_info = {
                'whitelevel_id': 0,
                'company_name': "SuperAdmin",
                'role': get_user_role_string(user.role),
            }
        else:
            company_info = {
                'whitelevel_id': user.whitelevel_id.whitelevel_id,
                'company_name': user.whitelevel_id.name,
                'role': get_user_role_string(user.role),
            }
        return Response({'authenticated': True, 'message': 'User is authenticated', 'info': company_info})
    else:
        # User is not authenticated
        return Response({'authenticated': False, 'message': 'User is not authenticated'})


def get_authenticated_user_whitelevel_id(request):
    user = request.user
    # Check if the user is authenticated
    if user.is_authenticated and user.whitelevel_id is not None:
        return user.whitelevel_id.whitelevel_id
    else:
        return -1
